import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserTree from "@/components/UserTree";

interface User {
  id: string;
  name: string;
  parentId: string | null;
  children: User[];
}

interface UserTreePageProps {
  data: any;
}

const fetchUserData = async (userId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}/children`, {
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
};

const UserTreePage = async () => {
  const cookieStore = cookies();
  const userInfo = cookieStore.get('userInfo')?.value;
  if (!userInfo) {
    // Redirect to login page if user is not logged in
    redirect('/');
    return null;
  }

  const userId = JSON.parse(userInfo).userId;
  const data = await fetchUserData(userId);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Header />
      <main className="flex-grow p-6">
        <div className="container mx-auto">
          <UserTree data={data.data} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserTreePage;