import { Nav, NavLink } from "@/components/Nav";

export default function AdminLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
        <Nav>
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Produtos</NavLink>
            <NavLink href="/admin/users">Clientes</NavLink>
            <NavLink href="/admin/orders">Vendas</NavLink>
        </Nav>
        <div className="container my-6">{children}</div>
        </>
    )
}