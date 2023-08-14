import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { server } from './../index';
import { Container, HStack, VStack, Image, Heading, Text, Button, RadioGroup, Radio } from '@chakra-ui/react';
import Loader from './Loader';
import ErrorComponent from './ErrorComponent';
import CoinCard from './CoinCard';
const Coins = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [currency, setCurrency] = useState('inr');

    const currencySymbol = currency === 'inr' ? '₹' : currency === 'eur' ? '€' : '$';
    const changePage = (page) => {
        setPage(page);
        setLoading(true);
    }

    const btn = new Array(132).fill(1);
    console.log(btn);
    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`)
                setCoins(data);
                console.log(data);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchCoins();
    }, [currency, page]);

    if (error) return <ErrorComponent message='Error While Fetching Coins' />

    return (
        <Container
            maxW={'container.xl'}
        >
            {loading ? <Loader /> :
                <>

                    <RadioGroup value={currency} onChange={setCurrency} p='8'>
                        <HStack>
                            <Radio value='inr' >INR</Radio>
                            <Radio value='usd'>USD</Radio>
                            <Radio value='eur'>EUR</Radio>
                        </HStack>
                    </RadioGroup>
                    <HStack wrap={'wrap'}>
                        {
                            coins.map((item) => {
                                return <CoinCard
                                    id={item.id}
                                    price={item.current_price}
                                    symbol={item.symbol}
                                    key={item.id}
                                    name={item.name}
                                    img={item.image}
                                    currencySymbol={currencySymbol}
                                />
                            })
                        }
                    </HStack>
                    <HStack overflowX='auto' w={'full'} p='8'>
                        {
                            btn.map((item, i) => (
                                <Button
                                    bgColor={'blackAlpha.900'}
                                    color='white'
                                    onClick={() => changePage(i + 1)}

                                >
                                    {i + 1}
                                </Button>
                            ))
                        }
                    </HStack>
                </>
            }
        </Container>
    )
}


export default Coins