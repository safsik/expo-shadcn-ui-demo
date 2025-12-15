const SpaceSelector = ({ items }) => {
    return (
        <div className="absolute top-0 start-0 w-screen h-10 z-[999]">
            { items.map((item) => {
                <a className="block p-2" href={ item.path }>{ item.title } { item.icon }</a>
            })}
        </div>
    )
}

export { SpaceSelector }