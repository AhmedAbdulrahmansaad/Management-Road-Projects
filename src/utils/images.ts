// Project Placeholder Images
export const projectImages = {
  highway: 'https://images.unsplash.com/photo-1571363604084-c652ecf0a106?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdod2F5JTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc2MjE3MjUzNnww&ixlib=rb-4.1.0&q=80&w=1080',
  roadEngineering: 'https://images.unsplash.com/photo-1725026350922-198260d5d9cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwZW5naW5lZXJpbmd8ZW58MXx8fHwxNzYyMjkzODMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  infrastructure: 'https://images.unsplash.com/photo-1708358131308-c2dad0046a73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmZyYXN0cnVjdHVyZSUyMHByb2plY3R8ZW58MXx8fHwxNzYyMjQ3OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
};

// Helper function to get random project image
export function getRandomProjectImage(): string {
  const images = Object.values(projectImages);
  return images[Math.floor(Math.random() * images.length)];
}
