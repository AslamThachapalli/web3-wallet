interface SelectionCardProps {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
}

export function SelectionCard(props: SelectionCardProps) {
    return (
        <div
            className="bg-gray-500 rounded-lg p-4 cursor-pointer flex items-center gap-4"
            onClick={props.onClick}
        >
            <div className="p-1 rounded-full bg-gray-400">{props.icon}</div>
            <p className="font-semibold">{props.title}</p>
        </div>
    );
}