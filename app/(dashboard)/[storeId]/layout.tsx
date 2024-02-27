import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import Navbar from '@/components/navbar'
import prismadb from '@/lib/prismadb';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  if (!isValidObjectId(params.storeId)) {
    // If not a valid ObjectID, handle accordingly (e.g., redirect or show error)
    console.error('Invalid storeId:', params.storeId);
    return redirect('/error-page'); // Adjust based on your error handling strategy
  }
  
  // Proceed with your query if the storeId is valid
  const store = await prismadb.store.findFirst({ 
    where: {
      id: params.storeId,
      userId,
    }
  });
  
  // const store = await pri smadb.store.findFirst({ 
  //   where: {
  //     id: params.storeId,
  //     userId,
  //   }
  //  });

  if (!store) {
    redirect('/');
  };

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
