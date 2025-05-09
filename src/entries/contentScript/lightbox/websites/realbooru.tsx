import { CollectImagesOptions, MediaListItem, MediaType } from '~/entries/contentScript/types';
import axios from 'axios';

export const realBooruCollectImages: CollectImagesOptions = {
    callback: async (): Promise<MediaListItem[]> =>
        Array.from(document.querySelectorAll('.items .col.thumb a')).map(el => ({
            el: el as HTMLElement,
            item: async () => {
                const parser = new DOMParser();
                const page = await axios.get((el as HTMLAnchorElement).href);
                const doc = parser.parseFromString(page.data, 'text/html');
                const mediaImage = doc.querySelector('#image') as HTMLImageElement;
                const mediaVideo = doc.querySelector('#gelcomVideoPlayer') as HTMLVideoElement
                let isVideo = !mediaImage;
                let src = '';
                if (mediaImage) {
                    src = mediaImage.src;
                } else if (mediaVideo) {
                    src = mediaVideo.querySelector('source')!.src;
                }
                return {
                    src,
                    type: isVideo ? MediaType.Video : MediaType.Image,
                    pageUrl: (el as HTMLAnchorElement).href,
                }
            },
        })),
    domains: ['realbooru.com'],
    getPrevPageUrl: () => document.querySelector('#paginator [alt=next]')?.getAttribute('href') ?? undefined,
    getNextPageUrl: () => document.querySelector('#paginator [alt=back]')?.getAttribute('href') ?? undefined,
}
