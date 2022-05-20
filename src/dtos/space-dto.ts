import {SpaceAttributes} from "../models/space.model";

class SpaceDto {
    space_id: number;
    user_id: number;
    name: string;
    is_public: boolean;

    constructor(model: SpaceAttributes) {
        this.space_id = model.space_id as number;
        this.user_id = model.user_id;
        this.name = model.name;
        this.is_public = model.is_public;
    }
}

class GeneralSpacesDto {

}

export { SpaceDto };
