import {Link} from '@remix-run/react';
import {useCallback, useEffect, useState} from 'react';
import {BsChevronCompactLeft, BsChevronCompactRight} from 'react-icons/bs';
import {RxDotFilled} from 'react-icons/rx';

export default function HeroSlider() {
  const slides = [
    {
      url: 'https://img.freepik.com/free-photo/buddha-bowl-dish-with-vegetables-legumes-top-view_1150-42589.jpg?w=996&t=st=1686900154~exp=1686900754~hmac=51adb37f3320c840c13dbecd58ccd380c19f3b7325770660fecd7675ae8e7c5b',
      title: 'Combo 7 món',
      description:
        'Odio esse quo aut ea sapiente vel expedita. Reprehenderit voluptatum officiis magni qui eos et assumenda. Et ut dolorem sed voluptas consequuntur dolor est.',
      to: '/login',
    },
    {
      url: 'https://img.freepik.com/premium-photo/photo-collage-healthy-keto-diet-fruits-vegetables-seafood-meat_187166-35473.jpg?w=1060',
      title: 'Combo 5 món',
      description:
        'Odio esse quo aut ea sapiente vel expedita. Reprehenderit voluptatum officiis magni qui eos et assumenda. Et ut dolorem sed voluptas consequuntur dolor est.',
      to: '/login',
    },
    {
      url: 'https://img.freepik.com/premium-photo/set-dishes-seafood-meat-vegetables-photo-collage-banner_187166-54434.jpg?w=1380',
      title: 'Combo 3 món',
      description:
        'Odio esse quo aut ea sapiente vel expedita. Reprehenderit voluptatum officiis magni qui eos et assumenda. Et ut dolorem sed voluptas consequuntur dolor est.',
      to: '/login',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="h-[calc(100vh-56px)] lg:h-[calc(100vh-120px)] w-full m-auto relative group">
      <div
        style={{
          backgroundImage: `url('${slides[currentIndex].url}')`,
        }}
        className="w-full h-full bg-center bg-cover duration-500 bg-green-700 text-center"
      >
        <Link
          to={slides[currentIndex].to}
          className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-b from-transparent to-[rgba(21,128,61,0.5)] h-full flex flex-col justify-end gap-6 py-[15vh] px-[15vw] text-white"
        >
          <h2 className="font-bold text-3xl">{slides[currentIndex].title}</h2>
          <p className="text-lg text-justify">
            {slides[currentIndex].description}
          </p>
        </Link>
      </div>
      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 cursor-pointer">
        <BsChevronCompactLeft fill="white" onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 cursor-pointer">
        <BsChevronCompactRight fill="white" onClick={nextSlide} size={30} />
      </div>
      <div className="flex top-4 justify-center py-2 -translate-y-12">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.url}
            onClick={() => goToSlide(slideIndex)}
            onKeyDown={() => {}}
            className={`cursor-pointer ${
              slideIndex === currentIndex
                ? 'text-3xl text-gray-100'
                : 'text-2xl text-gray-300'
            }`}
          >
            <RxDotFilled />
          </button>
        ))}
      </div>
    </div>
  );
}
