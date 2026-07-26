import { navigation } from "./data";
import NavItem from "./NavItem";

export default function DesktopNav() {
    return (
        <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Main Navigation"
        >
            {navigation.map((item) => (
                <NavItem
                    key={item.href}
                    item={item}
                />
            ))}
        </nav>
    );
}