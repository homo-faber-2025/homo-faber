'use client';

import styled from '@emotion/styled';
import { memo } from 'react';

const EditorArticle = styled.article`
  // box-shadow: inset 0 0 10px 10px green;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  // margin-right: 80px;
`
const EditorPara = styled.p`
  // box-shadow: isnet 0 0 10px 10px blue;
  font-family: var(--font-noto);
  font-weight: 400;
  font-size: 1.5rem;
  line-height: 1.88;
  letter-spacing: 0.01rem;
  word-break: keep-all;
  margin-left: 11dvw;
  text-indent: 80px;
  // margin-bottom: 180px;
  position: relative;
  

  & b {
    display: block;
    font-family: var(--font-gothic);
    font-weight: 700;
    font-size: 1.4rem;
    line-height: 1.6;
    letter-spacing: 0.03rem;
    margin-bottom: 35px;
    margin-top: 200px;
    margin-left: -11dvw;
    margin-right: 2dvw;
    text-indent: 0px;
    // position: relative;
  }

  & .sticker{
    cursor: pointer;
    position: relative;
    z-index: 99;
    color: red;
    font-weight: 900;
    margin-top: -20px;
    top: -3px;

    &:hover ~ i{
      display: inline;
      width: 100%;
      height: 100%;
      position: sticky;
    }
  }

  & i {
    position: relative;
    // width: 21dvw;
    width: 0px;
    height: 0px;
    margin: unset;
    margin-left: -12px;
    margin-top: 2px;
    // background: yellow;
    font-size: 1rem;
    padding: 17px 0px 19px 18px;
    z-index: 10;
    display: none;
    text-indent: 0;
    transition: all .4s;

    &:hover{
    position: sticky;
      display: inline;
      width: 100%;
      height: 100%;
    }

    &::before{
      content: '(';
    }
    &::after{
      content: ')';
      // display: block;
      // text-align: right;
      // margin-top: 20px;
    }
  }

  & mark {
    background: none;
    position: relative;
    display: inline;
    text-decoration: underline dotted 2px black;
    text-underline-position: under;
    text-underline-offset: 4.5px;
    line-height: 2.1;
  }
`
const EditorIntro = styled.h3`
  box-shadow: inset 0 0 10px 10px pink;
`
const EditorImgWrapper = styled.div`
  width: calc(100% - 11dvw - 9px);
  margin-left: auto;
  margin-top: 40px;
`

const EditorImg = styled.img`
  width: 100%;
`
const EditorImgCaption = styled.div`
  font-family: var(--font-gothic);
  margin-top: 6px;
  text-align: right;
  opacity: 0.5;
`

function EditorInterviewRender({ item }) {

  return (
    <>
      <EditorArticle>
        {item.map((block, idx) => (
          <div key={idx}>
            {block.type === 'paragraph' ? (
              <>
                <EditorPara dangerouslySetInnerHTML={{ __html: block.data.text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\n/g, '<br />').replace(/\*/g, '<span class="sticker">*</span>') }} />
              </>
            ) : (
              ''
            )}
            {block.type === 'header' && [1, 2, 3].includes(block.data.level) ? (
              <EditorIntro
                dangerouslySetInnerHTML={{
                  __html: block.data.text.replace(/\n/g, '<br />'),
                }}
              />
            ) : (
              <></>
            )}
            {block.type === 'image' ? (
              <EditorImgWrapper>
                <EditorImg src={block.data.file.url} alt={block.data.caption ? block.data.caption : 'Image'} />
                {block.data.caption ? (
                  <EditorImgCaption
                    dangerouslySetInnerHTML={{
                      __html: block.data.caption.replace(/\n/g, '<br />'),
                    }}
                  />
                ) : (
                  <></>
                )}
              </EditorImgWrapper>
            ) : (
              <></>
            )}
          </div >
        )
        )
        }
      </EditorArticle >
    </>
  )
}

export default memo(EditorInterviewRender);
