export function formatDatabaseError(error: any): string {
  if (error.code === 'P2002') {
    return `Unique constraint failed on field: ${error.meta?.target}`;
  }
  if (error.code === 'P2025') {
    return 'Record not found';
  }
  return error.message || 'Unknown database error';
}