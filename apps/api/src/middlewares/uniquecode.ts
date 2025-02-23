import prisma from '@/prisma';

export default async function generateReferralCode(
  firstName: string,
): Promise<string> {
  const codeLength = 4; // Number of digits
  let uniqueCode: string = ''; // Initialize with a default value
  let isUnique = false;

  // Remove spaces from firstName
  const sanitizedFirstName = firstName.replace(/\s+/g, '').toUpperCase();

  while (!isUnique) {
    // Generate a 4-digit random number
    const randomCode = Math.floor(Math.random() * 10 ** codeLength)
      .toString()
      .padStart(codeLength, '0');
    uniqueCode = `${sanitizedFirstName}${randomCode}`;

    // Check if the code already exists in the database
    const existingUser = await prisma.user.findFirst({
      where: { referralCode: uniqueCode },
    });

    // If the code does not exist, it is unique
    if (!existingUser) {
      isUnique = true;
    }
  }

  console.log('Generated Unique Code:', uniqueCode); // For debugging
  return uniqueCode;
}

export function generateVoucherCode(voucherName: string): string {
  const firstWord = voucherName.split(' ')[0];
  const randomNumbers = Math.floor(10000 + Math.random() * 90000).toString();
  return `${firstWord}${randomNumbers}`;
}
