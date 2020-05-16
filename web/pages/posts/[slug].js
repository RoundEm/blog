// import { useEffect, useState } from 'react'
import Link from 'next/link'
import client from '../../client'
import styled from 'styled-components'
import moment from 'moment'
import Highlight, { defaultProps } from 'prism-react-renderer'
import HeaderLayout from '../../components/HeaderLayout'
import themes, { colors } from '../../colorsAndThemes'

const MainContent = styled.div`
    margin-top: 1.5em;
    font-size: 1.15em;
    line-height: 1.75em;
`
const PDesc = styled.p`
    font-size: 1.1em;
    color: ${({ theme }) => theme.primaryColor};
    margin: 3px 0 0;
`
const PDate = styled(PDesc)`
    font-size: 1em;
    color: ${({ theme }) => theme.text};
`
const PBlock = styled.p`
    margin-bottom: 1em;
`
const AsideBlock = styled.div`
    margin-bottom: 1em;
    padding: 1em 2em;
    background-color: ${({ theme }) => theme.asideBackground};
    font-size: .9em;
    /* TODO: dynamically change border and text according to theme? */
    /* light text: rgb(178, 151, 98) */
    /* light border: */
    /* border-left: 1px solid var(--primary-color); */
    border-left: 1px solid rgba(114, 143, 203, .5);
`
const Pre = styled.pre`
    font-family: 'Nanum Gothic Coding', monospace;
    font-size: .9em;
    overflow: auto;
    text-align: left;
    margin: 1em 0;
    padding: 0.5em;
    & .token-line {
        line-height: 1.4em;
        height: 1.3em;
    }
    /* box-shadow: 0px 6px 7px -4px; */
`
const LineNo = styled.span`
    display: inline-block;
    width: 2em;
    user-select: none;
    opacity: 0.3;
`
const ExternalLink = styled.a`
    text-decoration: underline;
    color: ${({ theme }) => theme.articleLinks};
`
const Button = styled.button`
    font-size: .8em;
    font-weight: bold;
    /* color: ${({ theme }) => theme.primaryColor}; */
    display: block; 
    margin: auto;
    /* background-color: ${({ theme }) => theme.secondaryColor};
    &:hover {
        background-color: ${({ theme }) => theme.primaryColor};
        color: ${({ theme }) => theme.secondaryColor};
    } */
`

function Post(props) {
    // console.log('propsPost: ', props)

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll)
    //     return () => window.removeEventListener('scroll', handleScroll)
    // }, [])

    // function handleScroll(e) {
    //     console.log('handleScroll e: ', e.target.scrollingElement.scrollTop)
    // }

    function handleScrollToTop() {
        window.scroll({
            top: 0, 
            behavior: 'smooth'
        })
    }

    const postContent = []
    
    // TODO: change these to use functional loops?:
    function paragraphBlock(section) {
        // console.log('paraSection: ', section)
        const blockContent = []
        for (let i = 0; i < section.children.length; i++) {
            if (section.children[i].marks.length > 0) {
                for (let j = 0; j < section.markDefs.length; j++) {
                    if (section.markDefs[j]._key === section.children[i].marks[0]) {
                        blockContent.push(
                            <ExternalLink 
                                target="_blank"
                                href={section.markDefs[j].href}
                                key={section.markDefs[j]._key}
                            >
                                {section.children[i].text}
                            </ExternalLink>
                        )
                    }
                }
            } else {
                blockContent.push(section.children[i].text)
            }
        }
        // console.log('blockContent: ', blockContent)
        return <PBlock key={section._key}>{blockContent}</PBlock>
    }

    function asideStringNewlines(content, _key) {
        const contentArray = content.split('\n')
        // console.log('contentArray: ', contentArray)
        const renderedLines = []
        for (let i = 0; i < contentArray.length; i++) {
            renderedLines.push(<div key={i}>{contentArray[i]}</div>)
        }
        return <AsideBlock key={_key}>{renderedLines}</AsideBlock>
    }
    
    function prismafyCodeBlock(content, _key) {
        return (
            <Highlight 
                {...defaultProps} 
                theme={
                    props.themeString === 'light'
                        ? themes.light.syntax
                        : themes.dark.syntax
                } 
                code={content} 
                language="jsx"
                key={_key}
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <Pre className={className} style={style}>
                        {tokens.map((line, i) => (
                            <div {...getLineProps({ line, key: i })}>
                                <LineNo>{i + 1}</LineNo>
                                {line.map((token, key) => {
                                    return (
                                        <span {...getTokenProps({ token, key })} />
                                    )
                                })}
                            </div>
                        ))}
                    </Pre>
                )}
            </Highlight>
        )
    }

    props.body && props.body.forEach(section => {
        switch(section._type) {
            case 'block':
                postContent.push(
                    paragraphBlock(section)
                )
                break
            case 'code':
                postContent.push(
                    prismafyCodeBlock(section.code, section._key)
                )
                break
            case 'post_aside':
                postContent.push(
                    asideStringNewlines(
                        section.str_content_newline, section._key
                    )
                )
                break
            // default:
            //     console.log('default case')
        }
        // console.log('postContent: ', postContent)
    })


    return (
        <HeaderLayout 
            onToggleThemeClick={props.onToggleThemeClick}
            themeString={props.themeString}
        >
            <article
                // onScroll={handleScroll}
            >
                <h2>{props.title}</h2>
                <PDesc>{props.description}</PDesc>
                {/* // TODO: Add _updatedAt field? */}
                <PDate>{moment.utc(props._createdAt).format("LL")}</PDate>
                <MainContent>
                    {postContent.map(content => content)}
                </MainContent>
            </article>

            <Button
                onClick={handleScrollToTop}
            >
                {/* ⬆︎ */}
                Back to top
                {/* ⬆︎ */}
            </Button>
            <br />
            <Link href="/">
                <a>
                    <Button>
                        Blog Home
                    </Button>
                </a>
            </Link>
            

        </HeaderLayout>
    )
}

export async function getStaticPaths() {
    const posts = await client.fetch(`
        *[ _type == "post" ]{
            ..., 
            tags[]->{_id, name}
        }
    `)
    // Get the paths we want to pre-render based on posts
    const paths = posts.map(post => ({
        params: { slug: post.slug.current },
    }))
    // Pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}
  
export async function getStaticProps(context) {
    const { slug } = context.params
    const post = await client.fetch(`
        *[_type == "post" && slug.current == $slug][0]
    `, { slug } )
    return { props: post }
}
  
// Post.getInitialProps = async function(context) {
//     // default the slug so that it doesn't return "undefined"
//     // console.log('context: ', context)
//     const { slug = "" } = context.query
//     const data = await client.fetch(`
//         *[_type == "post" && slug.current == $slug][0]
//     `, { slug })
//     return data
// }

export default Post