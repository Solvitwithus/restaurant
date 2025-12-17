
import React from 'react';
import Menu from '../components/dasrestaurosch/posmenu';
import ItemInventory from '../components/dasrestaurosch/itemInventory';
;

function Page() {
  return (
 <div className="min-h-screen overflow-y-auto  bg-[#F7F5EE]">
  <Menu />
<ItemInventory/>
</div>

  );
}

export default Page;