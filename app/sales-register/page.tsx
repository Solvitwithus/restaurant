// app/page.tsx or wherever your Page is
import React from 'react';
import Menu from '../components/dasrestaurosch/posmenu';
import Posdisplaypanem from '../components/dasrestaurosch/pos-displaypanem';
import Posregisteritemsection from '../components/dasrestaurosch/posregisteritemsection';

function Page() {
  return (
  <div className="max-h-screen min-w-min bg-[#F7F5EE]">
  <Menu />
  <div className="flex my-4 gap-1 mx-2">
    <Posdisplaypanem />
    <Posregisteritemsection />
  </div>
</div>

  );
}

export default Page;