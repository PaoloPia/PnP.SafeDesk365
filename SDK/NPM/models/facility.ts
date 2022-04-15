import {Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class Facility implements Parsable {
    /** The id property  */
    private _id?: number | undefined;
    /** The name property  */
    private _name?: string | undefined;
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "id": n => { this.id = n.getNumberValue(); },
            "name": n => { this.name = n.getStringValue(); },
        };
    };
    /**
     * Gets the id property value. The id property
     * @returns a integer
     */
    public get id() {
        return this._id;
    };
    /**
     * Sets the id property value. The id property
     * @param value Value to set for the id property.
     */
    public set id(value: number | undefined) {
        this._id = value;
    };
    /**
     * Gets the name property value. The name property
     * @returns a string
     */
    public get name() {
        return this._name;
    };
    /**
     * Sets the name property value. The name property
     * @param value Value to set for the name property.
     */
    public set name(value: string | undefined) {
        this._name = value;
    };
    /**
     * Serializes information the current object
     * @param writer Serialization writer to use to serialize this model
     */
    public serialize(writer: SerializationWriter) : void {
        if(!writer) throw new Error("writer cannot be undefined");
        writer.writeNumberValue("id", this.id);
        writer.writeStringValue("name", this.name);
    };
}
