// Check if current user has any confirmed enrollment
export function hasConfirmedEnrollment(userId: string | undefined): boolean {
  if (!userId) return false;
  
  try {
    const enrollmentsData = localStorage.getItem('enrollments');
    if (!enrollmentsData) return false;
    
    const enrollments = JSON.parse(enrollmentsData);
    return enrollments.some(
      (e: any) => e.userId === userId && e.status === 'confirmed'
    );
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return false;
  }
}

// Get all confirmed enrollments for a user
export function getUserEnrollments(userId: string | undefined) {
  if (!userId) return [];
  
  try {
    const enrollmentsData = localStorage.getItem('enrollments');
    if (!enrollmentsData) return [];
    
    const enrollments = JSON.parse(enrollmentsData);
    return enrollments.filter(
      (e: any) => e.userId === userId && e.status === 'confirmed'
    );
  } catch (error) {
    console.error('Error getting user enrollments:', error);
    return [];
  }
}
