type TitlePropTypes = {
    text: string;
}

export function Title({text}: TitlePropTypes) {
    return <h3 className="text-lg font-semibold my-2 dark:text-gray-400">{text}</h3>;
}
