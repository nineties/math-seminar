#include <stdio.h>
#include <stdlib.h>
#define N 30
int main()
{
    int i, v;
    char state[8];
    struct random_data rnd;
    rnd.state = 0;
    initstate_r(0, state, sizeof(state), &rnd);
    for (i = 0; i < N; i++) {
        random_r(&rnd, &v);
        printf("%d\n", v%8);
    }
    return 0;
}
