import { useEffect, useState } from "react";
import { Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Motivational = () => {
  const quotes = [
    {
      quote: "Nobody cares what you did yesterday. What have you done today to better yourself?",
      author: "David Goggins",
    },
    {
      quote: "You want to be uncommon amongst uncommon people. Period.",
      author: "David Goggins",
    },
    {
      quote: "Like the Taoists say, those that know don’t speak, and those who speak, well, they don’t know jack shit.",
      author: "David Goggins",
    },
    {
      quote: "When you think that you are done, you’re only 40% into what your body’s capable of doing. That’s just the limits that we put on ourselves.",
      author: "David Goggins",
    },
    {
      quote: "You gotta start your journey. It may suck, but eventually you will come out the other side on top.",
      author: "David Goggins",
    },
    {
      quote: "Motivation is a crap. Motivation comes and goes. When you’re driven, whatever is in front of you will get destroyed.",
      author: "David Goggins",
    },
    {
      quote: "Denial is the ultimate comfort zone.",
      author: "David Goggins",
    },
    {
      quote: "If you can get through doing things that you hate to do, on the other side is greatness.",
      author: "David Goggins",
    },
  ];

  const [quote, setQuote] = useState({ quote: '', author: '' });



  useEffect(() => {
    const fetchQuote = async () => {
      const storedDate = await AsyncStorage.getItem('date');
      const currentDate = new Date().toISOString().split('T')[0];

      if (storedDate !== currentDate) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
        await AsyncStorage.setItem('quote', JSON.stringify(randomQuote));
        await AsyncStorage.setItem('date', currentDate);
      } else {
        const storedQuote = await AsyncStorage.getItem('quote');
        setQuote(storedQuote ? JSON.parse(storedQuote) : { quote: '', author: '' });
      }
    };

    fetchQuote();
  }, []);


  return (
    <>
      <Text className="color-white text-lg text-center font-medium">{quote.quote}</Text>
      <Text className="color-white text-lg text-right italic">- {quote.author}</Text>
    </>
  );

};

export default Motivational;
