type resource = "text" | "img" | "video"

export const posts = [
    {
        id: 1, title: "Mujer", vertical: [
            {
                id: 1, resource: {
                    type: "img",
                    url: "/assets/imgs/1.jpg"
                }
            },
            {
                id: 2, resource: {
                    type: "video",
                    url: "/assets/videos/1.mp4"
                }
            },
            {
                id: 3, resource: {
                    type: "img",
                    url: "/assets/imgs/2.jpg"
                }
            },
        ]
    },
    {
        id: 2, title: "Hombre", vertical: [
            {
                id: 1, resource: {
                    type: "img",
                    url: "/assets/imgs/3.jpg"
                }
            },
            {
                id: 2, resource: {
                    type: "img",
                    url: "/assets/imgs/4.jpg"
                }
            },
            {
                id: 3, resource: {
                    type: "video",
                    url: "/assets/videos/2.mp4"
                }
            },
        ]
    },
    {
        id: 3, title: "Niños", vertical: [
            {
                id: 1, resource: {
                    type: "img",
                    url: "/assets/imgs/5.jpg"
                }
            },
            {
                id: 2, resource: {
                    type: "video",
                    url: "/assets/videos/3.mp4"
                }
            },
            {
                id: 3, resource: {
                    type: "video",
                    url: "/assets/videos/4.mp4"
                }
            },
        ]
    },
];
