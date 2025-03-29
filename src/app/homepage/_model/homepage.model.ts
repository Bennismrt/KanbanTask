export interface MockData {
    id: string
    task: string, 
    developer: Developer[], 
    status: string, 
    priority: string, 
    type: string, 
    date: string, 
    estimatedSP: Number, 
    actualSP: Number,
    isChecked: Boolean
}

export interface Developer {
    id: string
    name: string
    image: string
}
