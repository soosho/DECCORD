import { Home, TerminalSquare, Wallet, User } from "lucide-react";

export const navigation = [
  {
    title: "Dashboard", // ✅ Now a top-level item
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Playground",
    url: "#",
    icon: TerminalSquare,
    items: [
      { title: "Faucet List", url: "/faucet-list" },
      { title: "Paid To Click", url: "/ptc" },
    ],
  },
  {
    title: "Wallets",
    url: "#",
    icon: Wallet,
    items: [
      { title: "Overview", url: "/wallets" },
      { title: "Deposit", url: "/deposit" },
      { title: "Withdraw", url: "/withdraw" },
      { title: "Transfer", url: "/transfer" },
      { title: "History", url: "/history" },
    ],
  },
  {
    title: "Account",
    url: "#",
    icon: User,
    items: [
      { title: "Account", url: "/account" },
      { title: "Activity", url: "/activity" },
    ],
  },
];
