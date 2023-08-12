def amount_to_words(amount):
    # Define words for numbers up to 19
    words_less_than_twenty = [
        "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
        "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
        "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ]

    # Define words for tens
    tens_words = [
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
        "Eighty", "Ninety"
    ]

    # Define words for large scale (thousands, lakhs, crores, etc.)
    large_scale_words = ["", "Thousand", "Lakh", "Crore"]

    # Function to convert a number less than 1000 to words
    def convert_less_than_thousand(num):
        if num == 0:
            return ""
        elif num < 20:
            return words_less_than_twenty[num] + " "
        elif num < 100:
            return tens_words[num // 10] + " " + convert_less_than_thousand(num % 10)
        else:
            return words_less_than_twenty[num // 100] + " Hundred " + convert_less_than_thousand(num % 100)

    def convert_decimal_part(decimal_part):
        if decimal_part == 0:
            return "Zero"
        return convert_less_than_thousand(int(decimal_part)) + "Paise"

    if amount == 0:
        return "Zero Rupees"

    integer_part = int(amount)
    decimal_part = round(amount - integer_part, 2) * 100  # Convert decimal to paise

    crore_part = integer_part // 10000000
    lakh_part = (integer_part % 10000000) // 100000
    thousand_part = (integer_part % 100000) // 1000
    remaining_part = integer_part % 1000

    words = ""

    if crore_part > 0:
        words += convert_less_than_thousand(crore_part) + "Crore "
    if lakh_part > 0:
        words += convert_less_than_thousand(lakh_part) + "Lakh "
    if thousand_part > 0:
        words += convert_less_than_thousand(thousand_part) + "Thousand "
    if remaining_part > 0:
        words += convert_less_than_thousand(remaining_part)

    if decimal_part > 0:
        words += "and " + convert_decimal_part(decimal_part)

    return words.strip() + ""
