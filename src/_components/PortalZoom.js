const PortalZoom = () => {

    const setzoom125 = () => {
        const element = document.getElementById('zoomadd')
        element.classList.remove('zoom100')
        element.classList.remove('zoom150')
        element.classList.add('zoom125')


    }
    const setzoom100 = () => {
        const element = document.getElementById('zoomadd')
        element.classList.remove('zoom125')
        element.classList.remove('zoom150')
        element.classList.add('zoom100')


    }
    const setzoom150 = () => {
        const element = document.getElementById('zoomadd')
        element.classList.remove('zoom100')
        element.classList.remove('zoom125')
        element.classList.add('zoom150')
    }

    return (<>
        <div className=" p-0">
            <div className="row m-0">
                <div className="zoom" id="zoomadd">
                    <div className="" >
                        <div className="App">
                        <button className="remove" onClick={setzoom100}>
                        Small A</button>
                            <button className="add" onClick={setzoom125}>
                                Medium A</button>                            
                            <button className="toggle" onClick={setzoom150}> Large A
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default PortalZoom;