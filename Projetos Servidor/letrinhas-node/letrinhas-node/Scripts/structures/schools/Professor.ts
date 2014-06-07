/**
 * Defines a professor in this app.
 */
class Professor {
    id: number;
    /**
     * The ID of the school associated with this professor.
     */
    schoolId: number;
    /**
     * The name of this professor.
     */
    name: string;
    /**
     * The email address of this professor.
     */
    emailAddress: string;
    /**
     * The telephone number of this professor.
     */
    telephoneNumber: string;
    /**
     * Url for this professor's picture.
     */
    photoUrl: string;
    /**
     * True if this professor is active. False otherwise.
     *
     * 'Active' means that the professor is giving lectures
     * in this school year.
     */
    isActive: boolean;
    /**
     * The user name that will be used to authenticate this
     * user, both in back-office and in the tablet.
     */
    username: string;
    /**
     * The password that will be used to authenticate this
     * user, both in back-office and in the tablet.
     */
    password: string;

    classIds: number[];
}

export = Professor;