// import { useEffect, useState } from 'react'
import Link from 'next/link'
import client from '../../client'
import styled from 'styled-components'
import moment from 'moment'
import Highlight, { defaultProps } from 'prism-react-renderer'
import Layout from '../../components/Layout'
import themes from '../../colorsAndThemes'
import matchExtLinkMarkDef from '../../utils/matchExtLinkMarkDef'

const MainContent = styled.div`
    margin-top: 1.5em;
    font-size: 1.15em;
    line-height: 1.75em;
`
const PostDescription = styled.p`
    font-size: 1.3em;
    color: ${({ theme }) => theme.primaryColor};
    margin: 3px 0 0;
`
const PostDate = styled(PostDescription)`
    font-size: 1em;
    color: ${({ theme }) => theme.text};
`
const ArticleBlock = styled.div`
    margin-bottom: 1em;
`
const AsideBlock = styled.div`
    margin-bottom: 1em;
    padding: 1em 2em;
    background-color: ${({ theme }) => theme.asideBackground};
    font-size: .9em;
    line-height: 1.25em;
    /* TODO: dynamically change border and text according to theme? */
    /* light text: rgb(178, 151, 98) */
    /* light border: */
    /* border-left: 1px solid var(--primary-color); */
    border: 1px solid rgba(114, 143, 203, .5);
    border-left: 2px solid rgba(114, 143, 203, .5);
    
`
const Pre = styled.pre`
    font-family: 'Nanum Gothic Coding', monospace;
    font-size: .9em;
    overflow: auto;
    text-align: left;
    margin: 1em 0;
    padding: 0.5em;
    /* TODO: is this doing anything? */
    & .token-line {
        line-height: 1.4em;
        height: 1.3em;
    }
`
const LineNo = styled.span`
    display: inline-block;
    width: 2em;
    user-select: none;
    opacity: 0.3;
`
const InlineCode = styled.span`
    font-family: 'Courier Prime', monospace;
    display: inline-block;
    padding: 0 5px;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.secondaryColor};
`
const AsideCode = styled(InlineCode)`
    font-size: .9em;
    margin-bottom: 1em;
    font-family: 'Courier Prime', monospace;
`
const AsideCodeDescription = styled.p`
    margin-top: 1.1em;
    display: block;
    font-weight: 400;
`
const CodeNote = styled.p`
    margin-top: -.5em;
    margin-bottom: 1.2em;
    font-style: italic;
    color: ${({ theme }) => theme.primaryColor};
`
const ExternalLink = styled.a`
    text-decoration: underline;
    color: ${({ theme }) => theme.articleLinks};
`
const Button = styled.button`
    font-size: .8em;
    font-weight: bold;
    display: block; 
    margin: auto;
    /* background-color: ${({ theme }) => theme.secondaryColor};
    &:hover {
        background-color: ${({ theme }) => theme.primaryColor};
        color: ${({ theme }) => theme.secondaryColor};
    } */
`
const H3 = styled.h3`
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 1.5em;
    font-family: 'Fjalla One', sans-serif;
    font-family: 'Cuprum', sans-serif;
`

function Post(props) {
    console.log('propsPost: ', props)
    function handleScrollToTop() {
        window.scroll({
            top: 0, 
            behavior: 'smooth'
        })
    }

    const postContent = []
    // TODO: change these to use functional loops?
    // TODO: move some of these functions to a separate file so this file is cleaner
    function paragraphBlock(section) {
        // console.log('paragraphBlock: ', section)
        const blockContent = []
        for (let i = 0; i < section.children.length; i++) {
            // TODO: find a better way to check type of section
            if (!section.children[i].marks) {
                // console.log('paragraphBlock inline code')
                blockContent.push(
                    <InlineCode>
                        {section.children[i].str_content_inline}
                    </InlineCode>
                )
            }
            // returns href of external link that matches href mark with actual href info
            else if (section.children[i].marks.length > 0) {
                const hrefTarget = matchExtLinkMarkDef(
                    section.children[i], 
                    section.markDefs
                )
                hrefTarget && (
                    blockContent.push(
                        <ExternalLink 
                            target="_blank"
                            href={hrefTarget.href}
                            key={hrefTarget._key}
                        >
                            {hrefTarget.text}
                        </ExternalLink>
                    )
                )
            } 
            else if (section.style === 'h3') {
                blockContent.push(<H3 key={section._key}>{section.children[0].text}</H3>)
            }
            // unformatted text block
            else {
                blockContent.push(section.children[i].text)
            }
        }
        console.log('blockContent: ', blockContent)
        return <ArticleBlock key={section._key}>{blockContent}</ArticleBlock>
    }

    function asideStringNewlines(content, _key) {
        const contentArray = content.split('\n')
        const renderedLines = []
        for (let i = 0; i < contentArray.length; i++) {
            renderedLines.push(
                <div key={i}>{contentArray[i]}</div>
            )
        }
        return <AsideBlock key={_key}>{renderedLines}</AsideBlock>
    }
    
    function asideWithCode(content, _key) {
        // console.log('asideWithCode: ', content)
        const renderedContent = []
        for (let i = 0; i < content.length; i++) {
            const { children } = content[i]
            if (children.length > 1) {
                for (let j = 0; j < children.length; j++) {
                    // inline text
                    if (children[j].text) {
                        renderedContent.push(children[j].text)
                    } 
                    // TODO: i don't think this is currently setup correctly since it pushes to blockContent but should probably be renderedContent. There's currently no ext links within a code aside so add some to test (add some to git log part?):
                    // else if (children[j].marks && children[j].marks.length > 0) {
                    //     // console.log('children[j]: ', children[j])
                    //     // console.log('content[i]: ', content[i])
                    //     const hrefTarget = matchExtLinkMarkDef(
                    //         children[j], 
                    //         content[i].markDefs
                    //     )
                    //     hrefTarget && (
                    //         console.log('CXXCXXCXCXXCXCX') ||
                    //         blockContent.push(
                    //             <ExternalLink 
                    //                 target="_blank"
                    //                 href={hrefTarget.href}
                    //                 key={hrefTarget._key}
                    //             >
                    //                 {hrefTarget.text}
                    //             </ExternalLink>
                    //         )
                    //     )
                    // }
                    else {
                        renderedContent.push(
                            <AsideCode>
                                {children[j].str_content_inline}
                            </AsideCode>
                        )
                    }
                }
            } 
            // TODO: Remove asterisk from sanity and fix rendering if necessary
            else if (children.length === 1 && children[0].text[0] === '*') {
                renderedContent.push(
                    <CodeNote>
                        {children[0].text.slice(1)}
                    </CodeNote>
                )
            }
            else {
                renderedContent.push(
                    <AsideCodeDescription>
                        {children[0].text}
                    </AsideCodeDescription>
                )
            }
        }
        // console.log('renderedContent: ', renderedContent)
        return <AsideBlock>{renderedContent}</AsideBlock>
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
            case 'post_aside_with_code':
                // console.log('section.body: ', section.body)
                postContent.push(
                    asideWithCode(
                        section.body, section._key
                    )
                )
                break
            // default:
            //     console.log('default case')
        }
        // console.log('postContent: ', postContent)
    })


    return (
        <Layout 
            onToggleThemeClick={props.onToggleThemeClick}
            themeString={props.themeString}
        >
            <article>
                <h2>{props.title}</h2>
                <PostDescription>{props.description}</PostDescription>
                {/* // TODO: Add _updatedAt field? */}
                <PostDate>
                    {props.manual_pub_date 
                        ? moment.utc(props.manual_pub_date).format("LL")
                        : moment.utc(props._createdAt).format("LL")
                    }
                </PostDate>
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
            
        </Layout>
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