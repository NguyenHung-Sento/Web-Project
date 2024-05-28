import { TbReportMoney } from 'react-icons/tb';
import { BsCartCheck, BsBoxSeam } from 'react-icons/bs';
import { HiUserGroup } from 'react-icons/hi';
import { BarChart } from '../../components';
import { useEffect, useState } from 'react';
import { apiGetDashboard } from '../../apis';
import { formatMoney } from '../../ultils/helper';


function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const response = await apiGetDashboard()
      setDashboard(response.result)
    }
    fetchDashboard()
  }, []);

  return (
    <div className="w-full">
      <h1 className='bg-white h-[75px] text-gray-800 flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Manage products</span>
      </h1>
      <div className="content bg-white mt-7 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-4 bg-yellow-200 rounded-lg">
            <div className="flex items-center bg-yellow-500 rounded-full p-2 mr-2">
              <BsCartCheck size={28} className="text-primary-color" />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Tổng số đơn hàng</p>
              <p>{dashboard?.totalOrder}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-200 rounded-lg">
            <div className="flex items-center bg-green-500 rounded-full p-2 mr-2">
              <TbReportMoney size={28} />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Tổng số doanh thu</p>
              <p>{formatMoney(dashboard?.revenue)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-200 rounded-lg">
            <div className="flex items-center bg-blue-500 rounded-full p-2 mr-2">
              <BsBoxSeam size={28} />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Sản phẩm đang bán</p>
              <p>{dashboard?.totalProduct}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-200 rounded-lg">
            <div className="flex items-center bg-red-500 rounded-full p-2 mr-2">
              <HiUserGroup size={28} />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Tổng số người dùng</p>
              <p>{dashboard?.totalUser}</p>
            </div>
          </div>
        </div>
        <div className="h-96 mt-8">
          <BarChart revenue={dashboard?.revenue} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;