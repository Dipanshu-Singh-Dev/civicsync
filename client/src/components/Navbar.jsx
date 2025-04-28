// No unused hooks or Link/navigate needed
// import React if needed for JSX (with new JSX transform this may be optional)
import { Button } from "@/components/ui/button";
import { logout } from "@/services/auth.service"; // Assuming you have a logout function
import {
  Menu,
  Mountain,
  UserRoundPlus,
  UserRound,
  CirclePlus,
  Plus,
  House,
  LogIn
} from "lucide-react"; // Import icons from lucide-react
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
      await logout(); // Call the API logout endpoint
      store.handleLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show a notification using shadcn/ui Toast)
    }
  };

  return (
    <header className="sticky top-0 bg-white flex h-20 w-full shrink-0 items-center border-b px-4 md:px-6 z-50">
      {" "}
      {/* Added padding and border */}
      {/* Brand Link - Text always visible */}
      <NavItem to="/">
        <Mountain className="h-6 w-6 mr-2" />
        <span className="font-semibold">CodeCollab</span>
      </NavItem>
      {/* Right side navigation items */}
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {" "}
        {/* Pushed to right, responsive gap */}
        {/* Create Issue Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <NavItem to="/create-issue">
              <Plus className="h-5 w-5 shrink-0 sm:mr-2" />{" "}
              {/* Icon with margin on sm+ */}
              <span className="hidden sm:inline">Create Issue</span>{" "}
              {/* Text hidden below sm */}
            </NavItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a new Issue</p>
          </TooltipContent>
        </Tooltip>
        {/* Conditional Auth Links/Info */}
        {user ? (
          <>
            {/* Welcome message - hidden on small screens for consistency */}
            <span className="hidden sm:inline text-sm font-medium text-foreground">
              Welcome, {user.username}!
            </span>
            {/* Logout Button - Remains unchanged as it's not a NavLink */}
            <Button onClick={handleLogout} size="sm">
              Logout
            </Button>
          </>
        ) : (
          <>
            {/* Login Link */}
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

            {/* Sign Up Link */}
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

// Removed the custom MenuIcon and MountainIcon components as they are replaced by lucide-react icons
