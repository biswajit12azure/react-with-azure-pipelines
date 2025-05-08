import NavTab from "_components/NavTab";
import UserList from "./userProfile/UserList";
import { Jurisdiction } from "container/energyAssistance";
import Users from "./userProfile/Users";



const Home =()=>{
  const tabConfig = [
    { label: "PROFILE AWAITING FOR APPROVAL", component: <UserList /> },
    { label: " MANAGE ORGANIZATION NAME PROFILES", component: <Users /> }, 
  ];

  return <NavTab tabConfig={tabConfig} />;
};

export default Home;