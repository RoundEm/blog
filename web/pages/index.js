import client from '../client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import Layout from '../components/Layout'
import KeywordTags from '../components/KeywordTags'
import sortObjProperties from '../utils/sortObjProperties.js'

const PostContainer = styled.li`
    margin: 25px 0 0 15px;
    padding: 7px 10px;
    font-size: 1.75em;
    background-color: ${({ theme }) => theme.listItemBgColor};
    transition: background 300ms;
    &:hover {
        cursor: pointer;
        background: ${({ theme }) => theme.secondaryColor};
        border: ${({ theme }) => theme.secondaryColor};
    }
`
const Title = styled.h3`
    font-family: 'Fjalla One', sans-serif;
    font-weight: 400;
    font-size: .75em;
`
const Description = styled.p`
    font-size: .6em;
    color: ${({ theme }) => theme.primaryColor};
`
const Date = styled.p`
    font-size: .5em;
`
const TagListItem = styled.li`
    display: inline-block;
    margin-right: 5px;
    padding: 3px 5px;
    font-family: 'Nanum Gothic Coding', monospace;
    font-size: .5em;
    color: ${({ theme }) => theme.secondaryColor};
    background: ${({ theme }) => theme.primaryColor};
`

// removes duplicate post objects by converting each post into a JSON string so that they can be compared and filtered using `new Set`, then parsing the final unique array of posts back to a normal array of objects
function uniquePostsArray(posts) {
    return [
        ...new Set(posts.map(postObj => {
            return JSON.stringify(postObj)
        }))
    ].map(postStr => {
       return JSON.parse(postStr)
    })
}

function getTagCountsData(tags) {
    return Promise.all(
        tags.map(async tag => {
            return await client.fetch(`
                *[ _id == $tagID ]{
                    name,
                    _id,
                    "count": count(
                        *[ 
                            _type == "post" && 
                            published &&
                            $tagID in tags[]._ref 
                        ]
                    )
                }[0]
            `, { tagID: tag._id })
        })
    )
}

function Index({ 
    posts, 
    tags, 
    themeString,
    onToggleThemeClick
}) {
    // console.log('posts: ', posts)
    // console.log('tags: ', tags)
    const [ allPosts ] = useState(posts)
    const [ filteredPosts, setFilteredPosts ] = useState([])
    const [ tagCounts, setTagCounts ] = useState([])
    const [ filteredTags, setFilteredTags ] = useState([])
    // console.log('tagCounts: ', tagCounts)

    useEffect(() => {
        getTagCountsData(tags)
            .then(tagCounts => setTagCounts(tagCounts))
            .catch(err => console.log('error getting tag counts: ', err))
    }, [])

    useEffect(() => {
        if (filteredTags.length > 0) {
            const _filteredPosts = []
            allPosts.forEach(post => {
                post.tags.forEach(tag => {
                    if (filteredTags.includes(tag._id)) {
                        _filteredPosts.push(post)
                    }
                })
            })  
            setFilteredPosts(
                uniquePostsArray(_filteredPosts)
            )
        } else {
            setFilteredPosts([])
        }
    }, [filteredTags])

    function handleTagFilter(e) {
        const selectedTagID = e.currentTarget.id
        if (selectedTagID === 'clearFilter') {
            setFilteredTags([])
        } else if (!filteredTags.includes(selectedTagID)) {
            setFilteredTags(state => [...state, selectedTagID])
        } else {
            setFilteredTags(filteredTags.filter(tag => {
               return tag !== selectedTagID
            }))
        }
    }

    const postsToRender = filteredPosts.length > 0 
        ? filteredPosts 
        : allPosts
    // console.log('postsToRender: ', postsToRender)
    return (
        <Layout 
            onToggleThemeClick={onToggleThemeClick} 
            themeString={themeString}
        >
            <h2>Filter by Tags:</h2>
            <KeywordTags 
                tags={tagCounts}
                handleTagFilter={handleTagFilter}
                filteredTags={filteredTags}
            />

            <h2>Posts:</h2>
            <ul>
                {sortObjProperties(postsToRender, 'manual_pub_date').map(
                    ({ 
                        _id, 
                        _createdAt,
                        manual_pub_date,
                        description, 
                        slug,
                        title, 
                        tags
                    }) => (
                        <Link
                            href='/posts/[slug]'
                            as={`/posts/${slug.current}`}
                            key={_id}
                        >
                            <a>
                                <PostContainer key={_id} tabIndex="0">
                                    <Title>{title}</Title>
                                    <Description>{description}</Description>
                                    <Date>
                                        {manual_pub_date 
                                            ? moment.utc(manual_pub_date).format("LL")
                                            : moment.utc(_createdAt).format("LL")
                                        }
                                    </Date>
                                    <ul>
                                        {sortObjProperties(tags, 'name').map(tag => {
                                            return (
                                                <TagListItem key={tag._id}>
                                                    {tag.name}
                                                </TagListItem>
                                            )
                                        })}
                                    </ul>
                                </PostContainer>
                            </a>
                        </Link>
                    )
                )}
            </ul>
        </Layout>
    )
}

export async function getStaticProps() {
    const posts = await client.fetch(`
        *[ _type == "post" && published ]{
            ..., 
            "postImg": image.asset->,
            tags[]->{_id, name}
        }
    `)

    const tags = await client.fetch(`
        *[ _type == "tag" ] {
            _id, name
        }
    `)

    return { 
        props: { 
            posts,
            tags
        } 
    }
}

export default Index