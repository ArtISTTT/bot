import * as bookingCommands from './booking';
import * as equipment from './equipment';
import * as startCommands from './start';

export default {
    ...bookingCommands,
    ...equipment,
}