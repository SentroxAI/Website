const stats = [
    {
        value: "50+",
        label: "Projects Delivered",
    },
    {
        value: "20+",
        label: "Happy Clients",
    },
    {
        value: "99%",
        label: "Client Satisfaction",
    },
];

export default function HeroStats() {
    return (
        <div className="mt-12 grid grid-cols-3 gap-8">
            {stats.map((stat) => (
                <div key={stat.label}>
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}