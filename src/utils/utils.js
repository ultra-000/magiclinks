// from my exercism solution: https://exercism.org/tracks/javascript/exercises/matching-brackets/solutions/Ultra-0000
export function isPaired(input)
{
    const stack = [];
    const pairs = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    for (const c of input)
    {
        if (c === '(' || c === '{' || c === '[')
        {
            stack.push(c);
        }

        else if (c === ')' || c === '}' || c === ']')
        {
            if (stack.pop() !== pairs[c])
            {
                return false; 
            }
        }
    }

    return stack.length === 0;
}