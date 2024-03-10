type TitlePropTypes = {
    text: string;
}

export function Title({text}: TitlePropTypes) {
    return <h3 className="text-lg font-medium my-2 text-gray-700 dark:text-gray-500">{text}</h3>;
}
