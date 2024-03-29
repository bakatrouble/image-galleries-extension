import axios from 'axios';
import { CollectImagesOptions, MediaListItem, MediaType } from '~/entries/contentScript/types';

const gelbooruCollectImages: CollectImagesOptions = {
    callback: async (): Promise<MediaListItem[]> =>
        Array.from(document.querySelectorAll('.thumbnail-preview a')).map(el => {
            const pid = el.getAttribute('id')!.slice(1);
            return ({
                el: el as HTMLElement,
                item: {
                    src: async () => {
                        const data = await axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&id=${pid}`);
                        return data.data.post[0].file_url;
                    },
                    label: <a href={(el as HTMLAnchorElement).href} target="_blank">Show image</a>,
                    type: MediaType.Image,
                },
            })
        }),
    domains: 'gelbooru.com',
}
export default gelbooruCollectImages;
