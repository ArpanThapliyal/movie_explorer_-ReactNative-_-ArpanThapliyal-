import { ImageSourcePropType } from "react-native";

export type ImageSliderType = {
    title:string;
    image:ImageSourcePropType;
}

export const ImageSlider =[
    {
        title:"hn ji kese ho sare",
        image: require('../assets/john.jpg'),

    },
    {
        title:"hn ji kese ",
        image: require('../assets/john.jpg')

    },
    {
        title:"hn",
        image: require('../assets/john.jpg')

    }
]