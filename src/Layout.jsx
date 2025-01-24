import { Outlet} from "react-router-dom"
import Footer from "./components/Footer"
import Header from "./components/Header"


const Layout = () => {

    return (
      <div className="flex h-screen">

        <main className="flex-1 bg-gray-100 overflow-y-auto">
          <div className="flex flex-col min-h-[95vh]">
            <Header />
            <div className="flex-1">
              <Outlet />
              </div>
            <Footer />
          </div>
        </main>
     
      </div>
    );
  };
  
  export default Layout;