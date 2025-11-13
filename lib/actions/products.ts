'use server';

import { redirect } from 'next/navigation';
import { getCurrentUser } from '../auth';
import { prisma } from '../prisma';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Price must be a non-negative number',
  }),
  quantity: z.coerce
    .number()
    .int()
    .min(0, 'Quantity must be a non-negative integer'),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
});

export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();
  const id = String(formData.get('id') || '');

  await prisma.product.deleteMany({
    where: { id: id, userId: user.id },
  });
}

export async function addProduct(formData: FormData) {
  const user = await getCurrentUser();

  const parsedData = productSchema.safeParse({
    name: String(formData.get('name') || ''),
    description: String(formData.get('description') || ''),
    price: String(formData.get('price') || ''),
    quantity: formData.get('quantity'),
    sku: String(formData.get('sku') || ''),
    lowStockAt: formData.get('lowStockAt'),
  });

  if (!parsedData.success) {
    throw new Error('Invalid product data');
  }

  try {
    await prisma.product.create({
      data: {
        ...parsedData.data,
        userId: user.id,
      },
    });
    redirect('/inventory');
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add product');
  }
}
