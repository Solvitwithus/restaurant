
import React from 'react';
import Menu from '../components/dasrestaurosch/posmenu';
import KitchenDisplay from '../components/dasrestaurosch/kitchenStatusUpdate';

function Page() {
  return (
  <div className="max-h-screen min-w-min bg-[#F7F5EE]">
  <Menu />
<KitchenDisplay/>
</div>

  );
}

export default Page;


