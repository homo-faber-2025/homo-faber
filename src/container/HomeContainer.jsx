'use client';

import * as S from '@/styles/home/homeContainer.style';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

function HomeContainer() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(null);
  const storeRef = useRef(null);
  const interviewRef = useRef(null);
  const wordRef = useRef(null);
  const projectRef = useRef(null);
  const contentWrapperRef = useRef(null);

  const sections = [
    { key: 'store', ref: storeRef, label: '업체' },
    { key: 'interview', ref: interviewRef, label: '인터뷰' },
    { key: 'word', ref: wordRef, label: '용어' },
    { key: 'project', ref: projectRef, label: '프로젝트 문의' },
  ];

  // Intersection Observer로 섹션 감지
  useEffect(() => {
    if (!contentWrapperRef.current) return;

    const observerOptions = {
      root: contentWrapperRef.current,
      rootMargin: '-30% 0px -50% 0px',
      threshold: [0, 0.1, 0.5, 1],
    };

    const sectionVisibility = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionKey = sections.find((s) => s.ref.current === entry.target)?.key;
        if (sectionKey) {
          sectionVisibility.set(sectionKey, entry.intersectionRatio);
        }
      });

      // 가장 많이 보이는 섹션을 active로 설정
      let maxRatio = 0;
      let mostVisibleSection = null;
      sectionVisibility.forEach((ratio, key) => {
        if (ratio > maxRatio && ratio > 0.1) {
          maxRatio = ratio;
          mostVisibleSection = key;
        }
      });

      if (mostVisibleSection) {
        setActiveSection(mostVisibleSection);
      }
    }, observerOptions);

    // 각 섹션 관찰 시작
    sections.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // 토글 클릭 시 해당 섹션으로 스크롤
  const handleToggleClick = (sectionKey) => {
    const targetRef = sections.find((s) => s.key === sectionKey)?.ref;
    if (targetRef?.current && contentWrapperRef.current) {
      const targetElement = targetRef.current;
      const container = contentWrapperRef.current;
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      const targetScrollTop = scrollTop + targetRect.top - containerRect.top - 100; // 100px offset

      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <S.HomeWrapper>
      <S.HomeDecoration />
      <S.HomePageName>청계천·을지로 기술유통중개소: 호모파베르</S.HomePageName>

      <S.HomeContentWrapper ref={contentWrapperRef}>
        <S.ContentContainer>
          <S.HomeImage>
            <Image 
              src='/img/DSC03100.jpg' 
              alt='청계천·을지로 기술유통중개소' 
              fill
              priority
              fetchPriority="high"
              style={{ objectFit: 'cover' }}
              sizes="100vw"
            />
          </S.HomeImage>
          <S.HomeTitle>
            <S.Intro>을지로의 제조업을 살리다</S.Intro>
            <S.Title>청계천·을지로 기술유통중개소: <br />호모파베르</S.Title>
            <S.HomeButton onClick={() => {
              router.push('/fnq');
            }}>작업 의뢰하기</S.HomeButton>
            <S.SubTitle>기술유통중개소에서 기술자들을 쉽게 만나보세요</S.SubTitle>
            <S.HomeArrow>⌅</S.HomeArrow>
          </S.HomeTitle>
        </S.ContentContainer>

        <S.HomeIntroductionContainer>
          <S.HomeToggleWrapper>
            <S.HomeToggle
              $active={activeSection === 'store'}
              onClick={() => handleToggleClick('store')}
            >
              업체
            </S.HomeToggle>
            <S.HomeToggle
              $active={activeSection === 'interview'}
              onClick={() => handleToggleClick('interview')}
            >
              인터뷰
            </S.HomeToggle>
            <S.HomeToggle
              $active={activeSection === 'word'}
              onClick={() => handleToggleClick('word')}
            >
              용어
            </S.HomeToggle>
            <S.HomeToggle
              $active={activeSection === 'project'}
              onClick={() => handleToggleClick('project')}
            >
              프로젝트 문의
            </S.HomeToggle>
          </S.HomeToggleWrapper>

          <S.HomeIntroduction ref={storeRef} className='store'>
            <S.HomeIntroTitle>
              내 작업에 맞는 청계천·을지로 기술자들을 <br /> 직접 찾아볼 수 있습니다
            </S.HomeIntroTitle>
            <S.HomeIntroSub>
              나에게 맞는 키워드를 선택하거나 검색하며 내 작업에 꼭 맞는 기술자를 찾아보세요!
            </S.HomeIntroSub>
            <S.HomeIntroButton onClick={() => {
              router.push('/store');
            }}>
              기술자 찾기
            </S.HomeIntroButton>
            <S.HomeIntroImage>
              <Image 
                src='/img/store.jpg' 
                alt='store' 
                width={500}
                height={500}
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </S.HomeIntroImage>
            <S.HomeIntroImageSecond>
              <Image 
                src='/img/store-detail.jpg' 
                alt='store-detail' 
                width={500} 
                height={500} 
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </S.HomeIntroImageSecond>
          </S.HomeIntroduction>

          <S.HomeIntroduction ref={interviewRef} className='interview'>
            <S.HomeIntroTitle>
              청계천·을지로 기술자들의 이야기를 들어볼 수 있습니다
            </S.HomeIntroTitle>
            <S.HomeIntroSub>
              기술자분들이 어떻게 작업하고 있는지 어떻게 이 장소에서 작업을 이어가고 있는지 이야기를 들어보세요!
            </S.HomeIntroSub>
            <S.HomeIntroButton onClick={() => {
              router.push('/interview');
            }}>
              인터뷰 보러가기
            </S.HomeIntroButton>
            <S.HomeIntroImage style={{ marginTop: '30px' }}>
              <Image 
                src='/img/interview.jpg' 
                alt='interview' 
                width={500} 
                height={500} 
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </S.HomeIntroImage>
            <S.HomeIntroImageSecond>
              <Image 
                src='/img/interview-02.jpg' 
                alt='interview-02' 
                width={500} 
                height={500} 
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </S.HomeIntroImageSecond>
          </S.HomeIntroduction>

          <S.HomeIntroduction ref={wordRef} className='word'>
            <S.HomeIntroTitle>
              제작에 필요한 용어를 알아볼 수 있습니다
            </S.HomeIntroTitle>
            <S.HomeIntroSub>
              나에게 필요한 공정이 무엇인지 찾아보거나 새로운 용어를 발견하고 아이디어에 적용해보세요!
            </S.HomeIntroSub>
            <S.HomeIntroButton onClick={() => {
              router.push('/word');
            }}>
              용어 공부하러 가기
            </S.HomeIntroButton>
            <S.HomeIntroImage style={{ marginTop: '30px' }}>
              <Image 
                src='/img/word.jpg' 
                alt='word' 
                width={500} 
                height={500} 
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </S.HomeIntroImage>
            <S.HomeIntroImageSecond>
              <Image 
                src='/img/word-01.jpg' 
                alt='word-01' 
                width={500} 
                height={500} 
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </S.HomeIntroImageSecond>
          </S.HomeIntroduction>

          <S.HomeIntroduction ref={projectRef} className='project'>
            <S.HomeIntroTitle>
              청계천·을지로 기술자들에게 직접 작품을 의뢰해볼 수 있습니다
            </S.HomeIntroTitle>
            <S.HomeIntroSub>
              작품에 대한 설명과 스케치를 보내주시면 적절한 기술자분들과 상담을 진행해드립니다!
            </S.HomeIntroSub>
            <S.HomeIntroButton onClick={() => {
              router.push('/fnq');
            }}>
              작품 의뢰하기
            </S.HomeIntroButton>
            <S.HomeIntroImage style={{ marginTop: '30px' }}>
              <Image 
                src='/img/fnq.jpg' 
                alt='fnq' 
                width={500} 
                height={500} 
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </S.HomeIntroImage>
            <S.HomeIntroImageSecond>
              <Image 
                src='/img/fnq-02.jpg' 
                alt='fnq-02' 
                width={400} 
                height={400} 
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </S.HomeIntroImageSecond>
          </S.HomeIntroduction>
        </S.HomeIntroductionContainer>

      </S.HomeContentWrapper>
    </S.HomeWrapper>
  );
}

export default HomeContainer;