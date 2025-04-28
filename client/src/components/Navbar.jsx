import { Button } from "@/components/ui/button";
import { logout } from "@/services/auth.service";
import { Mountain, UserRoundPlus, Plus, LogIn, BarChart } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useStore } from "@/store";

const NavItem = ({ to, children, ...props }) => {
  const className2 =
    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";
  return (
    <NavLink to={to} className={className2} {...props}>
      {children}
    </NavLink>
  );
};

export default function Navbar() {
  const store = useStore();
  const { user } = store;

  const handleLogout = async () => {
    try {
      await logout();
      store.handleLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 bg-white flex h-20 w-full shrink-0 items-center border-b px-4 md:px-6 z-50">
      <NavItem to="/" className="flex items-center gap-2">
        <img src="logo.png" alt="Civicsync" width={32} height={32} />
        <span className="font-semibold text-xl">Civicsync</span>
      </NavItem>
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {user ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavItem to="/create-issue">
                  <Plus className="h-5 w-5 shrink-0 sm:mr-2" />
                  <span className="hidden sm:inline">Create Issue</span>
                </NavItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new Issue</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavItem to="/visualise">
                  <BarChart className="h-5 w-5 shrink-0 sm:mr-2" />
                  <span className="hidden sm:inline">Visualise</span>
                </NavItem>
              </TooltipTrigger>

              <TooltipContent>Visualise the data</TooltipContent>
            </Tooltip>
            <span className="hidden sm:inline text-sm font-medium text-foreground">
              Welcome, {user.email}!
            </span>
            <Button onClick={handleLogout} size="sm">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Tooltip delayDuration={250}>
              <TooltipTrigger asChild>
                <NavItem to="/">
                  <LogIn className="h-5 w-5 shrink-0 sm:mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </NavItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Login</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavItem to="/signup">
                  <UserRoundPlus className="h-5 w-5 shrink-0 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Up</span>
                </NavItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign Up</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </header>
  );
}
