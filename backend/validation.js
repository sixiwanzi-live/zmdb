export default {
    organization: {
        name: {
            lowerLimit: 1,
            upperLimit: 20
        }
    },
    author: {
        name: {
            lowerLimit: 1,
            upperLimit: 30
        }
    },
    clip: {
        title: {
            lowerLimit: 1,
            upperLimit: 30
        },
        datetime: {
            limit: 19
        },
        content: {
            lowerLimit: 1,
            upperLimit: 20
        }
    },
    subtitle: {
        content: {
            lowerLimit: 1
        }
    },
    segment: {
        interval: {
            lowerLimit: 1000,
            upperLimit: 10 * 60 * 1000
        }
    }
}