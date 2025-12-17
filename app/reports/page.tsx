import React from 'react';
import Menu from '../components/dasrestaurosch/posmenu';

function Page() {
  return (
    <div className="min-h-screen w-full bg-[#F7F5EE] flex flex-col">
      <Menu />

      <main className="flex-1 w-full px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Held Orders History</h2>
        <h2 className="text-2xl font-bold mb-4">POS Transactions</h2>
        <h2 className="text-2xl font-bold">Payments Aggregates</h2>
      </main>
    </div>
  );
}

export default Page;
