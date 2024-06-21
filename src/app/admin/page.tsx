import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";


type DashboardCardProps = {
    title: string
    subtitle: string
    body: string
}

function wait(duration: number) {
    return new Promise(resolve => setTimeout(resolve, duration))
}

async function getSalesData() {
    const data = await db.order.aggregate({
        _sum: { pricePaidInCents: true },
        _count: true
    })

    return {
        amount: (data._sum.pricePaidInCents || 0) / 100,
        numberOfSales: data._count
    }
}

async function getUserData() {
    const [userCount, orderData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum: { pricePaidInCents: true },
        })
    ])

    return {
        userCount,
        avarageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100
    }
}

async function getProductData() {
    const [activeCount, inactiveCount] = await Promise.all([
        db.product.count({ where: { isAvailableForPurchase: true } }),
        db.product.count({ where: { isAvailableForPurchase: false } })
    ])

    return { activeCount, inactiveCount }
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardDescription>{subtitle}</CardDescription>
            <CardContent>
                <p>{body}</p>
            </CardContent>
        </Card>
    )
}



export default async function AdminDashboard() {
    const [salesData, userData, productData] = await Promise.all([
        getSalesData(),
        getUserData(),
        getProductData()
    ])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard title="Vendas" subtitle={`${formatNumber(salesData.numberOfSales)} Pedidos`} body={formatCurrency(salesData.amount)} />
            <DashboardCard title="Cliente" subtitle={`${formatNumber(userData.avarageValuePerUser)} Valor Medio`} body={formatCurrency(userData.userCount)} />
            <DashboardCard title="Produtos ativos" subtitle={`${formatNumber(productData.inactiveCount)} Inativos`} body={formatCurrency(productData.activeCount)} />
        </div>
    )
}