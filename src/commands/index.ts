import * as additional from './additional';
import * as bookingCommands from './booking';
import * as equipment from './equipment';
import * as manage from './manageBooking';
import * as startCommands from './start';

export default {
    ...bookingCommands,
    ...equipment,
    ...manage,
    ...additional,
}