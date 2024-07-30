import Mux from "@mux/mux-node"

export const mux = new Mux({
    tokenId: process.env.MUX_ACCESS_TOKEN!,
    tokenSecret: process.env.MUX_SECRET_KEY!
})