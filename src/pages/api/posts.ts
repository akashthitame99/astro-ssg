import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    // const data = [
    //     {
    //         id: 1,
    //         name: 'John Doe',
    //         email: 'john@example.com',
    //         age: 25,
    //     },
    //     {
    //         id: 2,
    //         name: 'Jane Doe',
    //         email: 'jane@example.com',
    //         age: 30,
    //     },
    //     {
    //         id: 3,
    //         name: 'Bob Smith',
    //         email: 'bob@example.com',
    //         age: 28,
    //     },
    // ]
    const posts = await fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())

    return new Response(
        JSON.stringify({
            posts
        }),
        { status: 200 }
    )
}