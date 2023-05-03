import { string } from "yup";

export type ExerciseDTO = {
    id: string;
    demo: string;
    group: string;
    name: string;
    repetitions: string;
    series: number;
    thumb: string;
    updated_at: string;
}

//ctrl+d seleciona todas as aspas e excluo e tipo só aquilo que quero.