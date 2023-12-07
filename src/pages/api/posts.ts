import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const posts = await fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())

    return new Response(
        JSON.stringify({
            posts
        }),
        { status: 200 }
    )
}

// export const getPostData = async () => {
//     const posts = await fetch('https://jsonplaceholder.typicode.com/posts')
//         .then(response => response.json())

//     return new Response(
//         JSON.stringify({
//             posts
//         }),
//         { status: 200 }
//     )
// }
