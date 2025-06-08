import React, { useEffect, useState } from 'react'


interface IUserList {
    id: number,
    name: string,
    checked: boolean
}

function SecPage() {

    const statusTypes = [
        {
            title: 'درحال دریافت ...',
            status: 'loading'
        },
        {
            title: 'خطا در دریافت',
            status: 'error'
        },
        {
            title: 'بیشتر...',
            status: 'success'
        }
    ]
    const [status, setStatus] = useState('none')

    const [allCarts, setAllCarts] = useState<IUserList[]>([])
    const [availableCarts, setAvailableCarts] = useState<IUserList[]>([])
    const [checkedCarts, setCheckedCarts] = useState<IUserList[]>(() => {
        const saved = localStorage.getItem('checkedCarts');
        return saved ? JSON.parse(saved) : [];
    })



    useEffect(() => {
        localStorage.setItem('availableCarts', JSON.stringify(availableCarts))
    }, [availableCarts])

    useEffect(() => {
        localStorage.setItem('checkedCarts', JSON.stringify(checkedCarts))
    }, [checkedCarts])


    const getData = async () => {
        setStatus('loading')
        try {
            await fetch('http://localhost:3010/usersList')
                .then(res => res.json())
                .then(data => {
                    setAllCarts(data)
                    setAvailableCarts(data.slice(0, 20))
                })
            setStatus('success')
        } catch (err) {
            setStatus('error')
        }
    }

    useEffect(() => {
        getData();
    }, [])

    const loadMore = () => {
        setAvailableCarts(prev => [
            ...prev, ...allCarts.slice(prev.length, prev.length + 20)
        ])
    }

    const checkCart = (id: number) => {
        const checkedCart = availableCarts.find(item => item.id === id);
        if (!checkedCart) return;
        setCheckedCarts(prev => {
            const exists = prev.some(item => item.id === id)
            if (exists) {
                return prev.filter(item => item.id !== id)
            }
            else return [...prev, checkedCart]
        })
    }



    return (
        <div>
            {
                availableCarts.map((item) => {
                    return (
                        <div className='cart' key={item.id}>
                            <span>{item.name}</span>
                            <input type="checkbox" onChange={() => checkCart(item.id)}
                                checked={checkedCarts.some(c => c.id === item.id)}
                            />
                        </div>
                    )
                })
            }
            <button onClick={loadMore}>
                {
                    statusTypes.find(item => item.status === status)?.title
                }
            </button>
        </div>
    )
}

export default SecPage