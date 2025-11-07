import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase clients
const getSupabaseAdmin = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const getSupabaseClient = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
);

// Initialize storage bucket
const initStorage = async () => {
  const supabase = getSupabaseAdmin();
  const bucketName = 'make-92709448-roads-files';
  
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
    console.log('Storage bucket created');
  }
};

// Initialize on startup
initStorage();

// Helper: Verify user authentication
const verifyUser = async (request: Request) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'Missing authorization token', user: null };
  }
  
  const supabase = getSupabaseAdmin();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return { error: 'Unauthorized', user: null };
  }
  
  return { error: null, user };
};

// ============================================
// AUTH ROUTES
// ============================================

// Sign up new user
app.post('/make-server-92709448/auth/signup', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Validate role
    const validRoles = ['general_manager', 'project_manager', 'engineer', 'observer'];
    if (!validRoles.includes(role)) {
      return c.json({ error: 'Invalid role' }, 400);
    }
    
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true // Auto-confirm since email server not configured
    });
    
    if (error) {
      console.log('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ user: data.user });
  } catch (error) {
    console.log('Sign up exception:', error);
    return c.json({ error: 'Internal server error during sign up' }, 500);
  }
});

// Get current user profile
app.get('/make-server-92709448/auth/profile', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  return c.json({ user });
});

// Update user profile
app.put('/make-server-92709448/auth/profile', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const { name } = await c.req.json();
    
    const supabase = getSupabaseAdmin();
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
      user!.id,
      { user_metadata: { ...user!.user_metadata, name } }
    );
    
    if (updateError) {
      return c.json({ error: updateError.message }, 400);
    }
    
    return c.json({ user: data.user });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// PROJECTS ROUTES
// ============================================

// Get all projects (with role-based filtering)
app.get('/make-server-92709448/projects', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const userRole = user!.user_metadata.role;
    const projects = await kv.getByPrefix('project:');
    
    // Filter based on role
    let filteredProjects = projects;
    if (userRole === 'project_manager' || userRole === 'engineer') {
      filteredProjects = projects.filter((p: any) => 
        p.value.managerId === user!.id || p.value.teamMembers?.includes(user!.id)
      );
    }
    
    const projectList = filteredProjects.map((p: any) => p.value);
    return c.json({ projects: projectList });
  } catch (error) {
    console.log('Get projects error:', error);
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

// Get single project
app.get('/make-server-92709448/projects/:id', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const projectId = c.req.param('id');
    const project = await kv.get(`project:${projectId}`);
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    return c.json({ project });
  } catch (error) {
    console.log('Get project error:', error);
    return c.json({ error: 'Failed to fetch project' }, 500);
  }
});

// Create new project (general_manager and project_manager only)
app.post('/make-server-92709448/projects', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const userRole = user!.user_metadata.role;
    // Check permissions: Only general_manager and project_manager can create projects
    if (userRole !== 'general_manager' && userRole !== 'project_manager') {
      return c.json({ error: 'Insufficient permissions. Only managers can create projects.' }, 403);
    }
    
    const projectData = await c.req.json();
    const projectId = crypto.randomUUID();
    
    const project = {
      id: projectId,
      ...projectData,
      createdBy: user!.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: projectData.status || 'planning',
      progress: projectData.progress || 0
    };
    
    await kv.set(`project:${projectId}`, project);
    return c.json({ project });
  } catch (error) {
    console.log('Create project error:', error);
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

// Update project
app.put('/make-server-92709448/projects/:id', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const projectId = c.req.param('id');
    const existingProject = await kv.get(`project:${projectId}`);
    
    if (!existingProject) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    const updates = await c.req.json();
    const updatedProject = {
      ...existingProject,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`project:${projectId}`, updatedProject);
    return c.json({ project: updatedProject });
  } catch (error) {
    console.log('Update project error:', error);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

// Delete project (general_manager only)
app.delete('/make-server-92709448/projects/:id', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const userRole = user!.user_metadata.role;
    if (userRole !== 'general_manager') {
      return c.json({ error: 'Only general managers can delete projects' }, 403);
    }
    
    const projectId = c.req.param('id');
    await kv.del(`project:${projectId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete project error:', error);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// ============================================
// DAILY REPORTS ROUTES
// ============================================

// Get daily reports for a project
app.get('/make-server-92709448/projects/:projectId/reports', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const projectId = c.req.param('projectId');
    const reports = await kv.getByPrefix(`report:${projectId}:`);
    const reportList = reports.map((r: any) => r.value);
    
    return c.json({ reports: reportList });
  } catch (error) {
    console.log('Get reports error:', error);
    return c.json({ error: 'Failed to fetch reports' }, 500);
  }
});

// Create daily report
app.post('/make-server-92709448/projects/:projectId/reports', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const projectId = c.req.param('projectId');
    const reportData = await c.req.json();
    const reportId = crypto.randomUUID();
    
    const report = {
      id: reportId,
      projectId,
      ...reportData,
      createdBy: user!.id,
      createdByName: user!.user_metadata.name,
      createdAt: new Date().toISOString(),
      status: reportData.status || 'pending'
    };
    
    await kv.set(`report:${projectId}:${reportId}`, report);
    return c.json({ report });
  } catch (error) {
    console.log('Create report error:', error);
    return c.json({ error: 'Failed to create report' }, 500);
  }
});

// Update report status (for approval)
app.put('/make-server-92709448/reports/:reportId/status', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const userRole = user!.user_metadata.role;
    if (userRole !== 'general_manager' && userRole !== 'project_manager') {
      return c.json({ error: 'Only managers can approve reports' }, 403);
    }
    
    const reportId = c.req.param('reportId');
    const { status } = await c.req.json();
    
    // Find the report
    const allReports = await kv.getByPrefix('report:');
    const reportEntry = allReports.find((r: any) => r.value.id === reportId);
    
    if (!reportEntry) {
      return c.json({ error: 'Report not found' }, 404);
    }
    
    const updatedReport = {
      ...reportEntry.value,
      status,
      approvedBy: user!.id,
      approvedAt: new Date().toISOString()
    };
    
    await kv.set(reportEntry.key, updatedReport);
    return c.json({ report: updatedReport });
  } catch (error) {
    console.log('Update report status error:', error);
    return c.json({ error: 'Failed to update report status' }, 500);
  }
});

// ============================================
// FILE UPLOAD ROUTES
// ============================================

// Upload file to storage
app.post('/make-server-92709448/upload', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    const fileName = `${folder}/${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    
    const supabase = getSupabaseAdmin();
    const { data, error: uploadError } = await supabase.storage
      .from('make-92709448-roads-files')
      .upload(fileName, arrayBuffer, {
        contentType: file.type
      });
    
    if (uploadError) {
      console.log('Upload error:', uploadError);
      return c.json({ error: uploadError.message }, 400);
    }
    
    // Generate signed URL (valid for 1 year)
    const { data: urlData } = await supabase.storage
      .from('make-92709448-roads-files')
      .createSignedUrl(fileName, 31536000);
    
    return c.json({ 
      path: fileName,
      url: urlData?.signedUrl 
    });
  } catch (error) {
    console.log('Upload exception:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Get signed URL for a file
app.get('/make-server-92709448/files/:path', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const path = c.req.param('path');
    
    const supabase = getSupabaseAdmin();
    const { data, error: urlError } = await supabase.storage
      .from('make-92709448-roads-files')
      .createSignedUrl(path, 3600); // 1 hour
    
    if (urlError) {
      return c.json({ error: urlError.message }, 400);
    }
    
    return c.json({ url: data.signedUrl });
  } catch (error) {
    console.log('Get file URL error:', error);
    return c.json({ error: 'Failed to get file URL' }, 500);
  }
});

// ============================================
// STATISTICS ROUTES
// ============================================

// Get dashboard statistics
app.get('/make-server-92709448/stats', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const projects = await kv.getByPrefix('project:');
    const reports = await kv.getByPrefix('report:');
    
    const userRole = user!.user_metadata.role;
    
    // Filter based on role
    let userProjects = projects.map((p: any) => p.value);
    if (userRole === 'project_manager' || userRole === 'engineer') {
      userProjects = userProjects.filter((p: any) => 
        p.managerId === user!.id || p.teamMembers?.includes(user!.id)
      );
    }
    
    const stats = {
      totalProjects: userProjects.length,
      activeProjects: userProjects.filter((p: any) => p.status === 'active').length,
      completedProjects: userProjects.filter((p: any) => p.status === 'completed').length,
      delayedProjects: userProjects.filter((p: any) => p.status === 'delayed').length,
      totalReports: reports.length,
      pendingReports: reports.filter((r: any) => r.value.status === 'pending').length,
      averageProgress: userProjects.length > 0 
        ? Math.round(userProjects.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / userProjects.length)
        : 0,
      recentActivities: reports
        .map((r: any) => r.value)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
    };
    
    return c.json({ stats });
  } catch (error) {
    console.log('Get stats error:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// Get project statistics by status
app.get('/make-server-92709448/stats/projects-by-status', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  if (error) return c.json({ error }, 401);
  
  try {
    const projects = await kv.getByPrefix('project:');
    const projectList = projects.map((p: any) => p.value);
    
    const byStatus = {
      planning: projectList.filter((p: any) => p.status === 'planning').length,
      active: projectList.filter((p: any) => p.status === 'active').length,
      delayed: projectList.filter((p: any) => p.status === 'delayed').length,
      completed: projectList.filter((p: any) => p.status === 'completed').length,
      onHold: projectList.filter((p: any) => p.status === 'on_hold').length
    };
    
    return c.json({ data: byStatus });
  } catch (error) {
    console.log('Get projects by status error:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// Health check
app.get('/make-server-92709448/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);